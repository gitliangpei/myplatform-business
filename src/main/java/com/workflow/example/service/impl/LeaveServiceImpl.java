package com.workflow.example.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.workflow.activiti.pojo.CommonHistory;
import com.workflow.activiti.pojo.CommonTask;
import com.workflow.activiti.pojo.CommonVariable;
import com.workflow.activiti.pojo.Variable;
import com.workflow.activiti.utils.HttpClient;
import com.workflow.example.dto.LeaveDto;
import com.workflow.example.entity.Leave;
import com.workflow.example.repository.LeaveRepository;
import com.workflow.example.service.LeaveService;

/**
 * 
 * 
 */
@Service
public class LeaveServiceImpl implements LeaveService {

	@Autowired
	private LeaveRepository leaveRepository;

	public List<Leave> query(){
		return leaveRepository.findAll();
	}
	
	public List<LeaveDto> queryTask(String userId){
		//1.通过用户id查询待办任务集合
		HttpClient client = new HttpClient();
		String url = "http://localhost:8888/activiti/web/workflow/task/"+userId+"?random="+Math.random();
		String json = client.get(url);
		List<CommonTask> list = JSON.parseArray(json, CommonTask.class); 
		
		//2.解析待办任务集合，获取业务主键
		String ids = "";
		int i = 0;
		Map taskMap = new HashMap<String,CommonTask>();
		for(CommonTask task : list){
			taskMap.put(task.getBusinessKey(), task);
			if(i!=0){
				ids += ",";
			}
			ids += task.getBusinessKey();
			i++;
		}
		
		if("".equals(ids)){
			ids = "xxx";
		}

		//3.返回代办业务集
		List<Leave> leaveList = leaveRepository.queryTask(ids.split(","));
		List<LeaveDto> result = new ArrayList<LeaveDto>();
		for(Leave leave : leaveList){
			LeaveDto vo = new LeaveDto();
			vo.setLeave(leave);
			vo.setTask((CommonTask)taskMap.get(leave.getId()));
			
			result.add(vo);
		}
		
		
		return result;
	}
	
	public List<LeaveDto> queryFinishedTask(String processDefinitionKey){
		//1.通过用户id查询待办任务集合
		HttpClient client = new HttpClient();
		String url = String.format("http://localhost:8888/activiti/web/workflow/finished/%s/%s/%s/%s?random=%s", processDefinitionKey,1,"null","null",Math.random());
		String json = client.get(url);
		List<CommonTask> list = JSON.parseArray(json, CommonTask.class); 
		
		//2.解析待办任务集合，获取业务主键
		String ids = "";
		int i = 0;
		Map taskMap = new HashMap<String,CommonTask>();
		for(CommonTask task : list){
			taskMap.put(task.getBusinessKey(), task);
			if(i!=0){
				ids += ",";
			}
			ids += task.getBusinessKey();
			i++;
		}
		
		if("".equals(ids)){
			ids = "xxx";
		}
		
		//3.返回已完成业务集
		List<Leave> leaveList = leaveRepository.queryTask(ids.split(","));
		List<LeaveDto> result = new ArrayList<LeaveDto>();
		for(Leave leave : leaveList){
			LeaveDto vo = new LeaveDto();
			vo.setLeave(leave);
			vo.setTask((CommonTask)taskMap.get(leave.getId()));
			
			result.add(vo);
		}
		
		
		return result;
	}
	
	public List<CommonHistory> queryHistory(String instanceId){
		//流程实例id查询历史
		HttpClient client = new HttpClient();
		String url = "http://localhost:8888/activiti/web/workflow/history/"+instanceId+"?random="+Math.random();
		String json = client.get(url);
		List<CommonHistory> list = JSON.parseArray(json, CommonHistory.class); 
		//获取变量详细list
		List<CommonVariable> varList = queryDetail(instanceId);
		//版本号
		int deptLeader = 0;
		int hr = 0;
		
		for(CommonHistory his : list){
			if("部门领导审批".equals(his.getTaskName())){
				
				his.setStatus(findVariableValue(varList, "deptLeaderPass", deptLeader));
				his.setReason(findVariableValue(varList, "leaderBackReason", deptLeader));
				deptLeader++;
			}
			else if("人事审批".equals(his.getTaskName())){
				his.setStatus(findVariableValue(varList, "hrPass", hr));
				his.setReason(findVariableValue(varList, "hrBackReason", hr));
				hr++;
			}
		}
		
		return list;
	}
	
	/**
	 * 
	 * 功能:依据变量名和版本号查找变量值
	 * 创建日期:2016-4-2 
	 * @param list
	 * @param varName
	 * @param rev
	 * @return
	 */
	private String findVariableValue(List<CommonVariable> list, String varName, int rev){
		String varValue = "";
		for(CommonVariable var : list){
			if(varName.equals(var.getName()) && rev == var.getRev()){
				varValue = var.getValue();
				break;
			}
		}
		return varValue;
	}
	
	public List<CommonVariable> queryDetail(String instanceId){
		//流程实例id查询历史
		HttpClient client = new HttpClient();
		String url = "http://localhost:8888/activiti/web/workflow/detail/"+instanceId+"?random="+Math.random();
		String json = client.get(url);
		List<CommonVariable> list = JSON.parseArray(json, CommonVariable.class); 
		
		return list;
	}
	
	public void insert(Leave po){
		leaveRepository.save(po);
	}
	
	public void update(Leave po){
		leaveRepository.save(po);
	}
	
	public void save(Leave po, String processDefinitionKey){
		String id = java.util.UUID.randomUUID().toString().replaceAll("-", "");
		po.setId(id);
		leaveRepository.save(po);
		//调用流程引擎，返回流程实例id
		HttpClient client = new HttpClient();
		String url = "http://localhost:8888/activiti/web/workflow/start?random="+Math.random();
		Map<String, String> params = new HashMap<String, String>();
		params.put("processKey", processDefinitionKey);
		params.put("businessKey", id);
		params.put("userId", po.getUserId());
		String processInstanceId = client.post(url, params);
		if(processInstanceId.indexOf("error") < 0){
			po.setProcessInstanceId(processInstanceId);
			leaveRepository.save(po);
		}
		else{
			leaveRepository.delete(id);
		}
	}
	
	public String complete(Variable variable){
		//调用流程引擎，返回流程实例id
		HttpClient client = new HttpClient();
		String url = "http://localhost:8888/activiti/web/workflow/complete?random="+Math.random();
		Map<String, String> params = new HashMap<String, String>();
		params.put("taskId", variable.getTaskId());
		params.put("keys", variable.getKeys());
		params.put("values", variable.getValues());
		params.put("types", variable.getTypes());
		String result = client.post(url, params);
		
		return result;
	}
	
	public String claim(String taskId, String userId){
		// 调用流程引擎，返回流程实例id
		HttpClient client = new HttpClient();
		String url = "http://localhost:8888/activiti/web/workflow/claim/" + taskId + "/" + userId + "?random=" + Math.random();
		String result = client.get(url);

		return result;
	}
	
}
