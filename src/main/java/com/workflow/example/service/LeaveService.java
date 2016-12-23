package com.workflow.example.service;

import java.util.List;

import com.workflow.activiti.pojo.CommonHistory;
import com.workflow.activiti.pojo.CommonVariable;
import com.workflow.activiti.pojo.Variable;
import com.workflow.example.dto.LeaveDto;
import com.workflow.example.entity.Leave;



/**
 * 
 * 创建日期:2014-10-29
 * Title:报警信息设置service接口
 */
public interface LeaveService {
	
	/**
	 * 
	 * 功能:查询任务调度列表
	 * 创建日期:2014-10-11 
	 * @param queryParams
	 * @return
	 */
	public List<Leave> query();
	
	/**
	 * 
	 * 功能:查询已完成任务记录
	 * 创建日期:2016-3-31 
	 * @param processDefinitionKey
	 * @return
	 */
	public List<LeaveDto> queryFinishedTask(String processDefinitionKey);
	
	/**
	 * 
	 * 功能:查询待办任务记录
	 * 创建日期:2016-3-31 
	 * @param userId
	 * @return
	 */
	public List<LeaveDto> queryTask(String userId);
	
	/**
	 * 
	 * 功能:根据流程实例id查询历史
	 * 创建日期:2016-4-1 
	 * @param instanceId
	 * @return
	 */
	public List<CommonHistory> queryHistory(String instanceId);
	
	/**
	 * 
	 * 功能:根据流程实例id查询流程变量详细
	 * 创建日期:2016-4-1 
	 * @param instanceId
	 * @return
	 */
	public List<CommonVariable> queryDetail(String instanceId);
	
	/**
	 * 
	 * 功能:新增记录
	 * 创建日期:2014-10-11 
	 * @param po
	 */
	public void insert(Leave po);
	
	public void update(Leave po);
	/**
	 * 
	 * 功能:保存请假
	 * 创建日期:2016-3-31 
	 * @param po
	 */
	public void save(Leave po, String processDefinitionKey);
	/**
	 * 
	 * 功能:办理任务
	 * 创建日期:2016-3-31 
	 * @param variable
	 * @return
	 */
	public String complete(Variable variable);
	
	/**
	 * 
	 * 功能:签收任务
	 * 创建日期:2016-4-1 
	 * @param taskId
	 * @param userId
	 * @return
	 */
	public String claim(String taskId, String userId);
	
}
