package com.workflow.activiti.pojo;

import java.io.Serializable;

/**
 * 
 * 创建日期:2016-3-29
 * Title:通用任务
 */
public class CommonTask implements Serializable {

    private static final long serialVersionUID = 1L;
    private String processInstanceId;
    private String userId;
    private String businessKey;
    private String taskId;


    public String getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
    
    

}
