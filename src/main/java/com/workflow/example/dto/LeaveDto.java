/**
 * 创建日期:2014-10-11
 */

package com.workflow.example.dto;

import com.workflow.activiti.pojo.CommonTask;
import com.workflow.example.entity.Leave;

/**
 * 创建日期:2014-10-11
 * Title:报警设置PO
 */
public class LeaveDto {
	
	//业务属性
	private Leave leave;
	//流程属性
	private CommonTask task;

	public Leave getLeave() {
		return leave;
	}

	public void setLeave(Leave leave) {
		this.leave = leave;
	}

	public CommonTask getTask() {
		return task;
	}

	public void setTask(CommonTask task) {
		this.task = task;
	}
	
	
}
