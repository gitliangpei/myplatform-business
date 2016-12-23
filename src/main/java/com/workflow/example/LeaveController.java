/**
 * 创建日期:2014-9-17
 */

package com.workflow.example;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.workflow.activiti.pojo.CommonHistory;
import com.workflow.activiti.pojo.Variable;
import com.workflow.example.dto.LeaveDto;
import com.workflow.example.entity.Leave;
import com.workflow.example.service.LeaveService;

/**
 * 创建日期:2014-9-17
 * Title:报警信息设置Controller
 */
@Controller
@RequestMapping("/leave")
public class LeaveController {

    
	@Autowired
	private LeaveService leaveService;
	
    //请假流程标识
    private static String processDefinitionKey = "leave";
    

    /**
     * 
     * 功能:列表查询
     * 创建日期:2014-9-17 
     * @param params
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public List<Leave> list() {
        
        List<Leave> list = leaveService.query();
        return list;
    }
    
    /**
     * 
     * 功能:查询待办任务记录
     * 创建日期:2016-3-31 
     * @return
     */
    @RequestMapping(value = "/taskList", method = RequestMethod.GET)
    @ResponseBody
    public List<LeaveDto> taskList(@RequestParam(value = "userId", required = true) String userId) {
    	
    	List<LeaveDto> list = leaveService.queryTask(userId);
    	return list;
    }
    
    @RequestMapping(value = "/finished", method = RequestMethod.GET)
    @ResponseBody
    public List<LeaveDto> finished() {
    	List<LeaveDto> list = leaveService.queryFinishedTask(processDefinitionKey);
    	return list;
    }
    
    /**
     * 
     * 功能:根据流程实例id查询历史
     * 创建日期:2016-4-1 
     * @param instanceId
     * @return
     */
    @RequestMapping(value = "/historyList", method = RequestMethod.GET)
    @ResponseBody
    public List<CommonHistory> historyList(@RequestParam(value = "instanceId", required = true) String instanceId) {
    	
    	List<CommonHistory> list = leaveService.queryHistory(instanceId);
    	return list;
    }
    
    
    /**
     * 
     * 功能:新增
     * 创建日期:2014-10-11 
     * @param po
     * @return
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public String save(@RequestBody Leave po) {
    	
    	leaveService.save(po,processDefinitionKey);
    	return "SUCCESS";
    }
    
    /**
     * 完成任务
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/complete", method = RequestMethod.POST)
    @ResponseBody
    public String complete(@RequestBody Variable variable) {
    	String result = "";
        try {
        	result = leaveService.complete(variable);
        } catch (Exception e) {
        	result = "error";
        }
        return result;
    }
    
    /**
     * 
     * 功能:签收任务
     * 创建日期:2016-4-1 
     * @param taskId
     * @param userId
     * @return
     */
    @RequestMapping(value = "/claim", method = RequestMethod.GET)
    @ResponseBody
    public String claim(@RequestParam(value = "taskId", required = true) String taskId,@RequestParam(value = "userId", required = true) String userId) {
    	String result = "";
    	try {
    		result = leaveService.claim(taskId,userId);
    	} catch (Exception e) {
    		result = "error";
    	}
    	return result;
    }
    
    
}
