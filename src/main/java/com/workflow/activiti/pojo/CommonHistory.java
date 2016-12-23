package com.workflow.activiti.pojo;

import java.io.Serializable;

import com.myplatform.common.utils.DateConverter;

/**
 * 
 * 创建日期:2016-3-29
 * Title:通用历史
 */
public class CommonHistory implements Serializable {

    private static final long serialVersionUID = 1L;
    //任务名称
    private String taskName;
    //任务开始时间
    private long startTime;
    //任务结束时间
    private long endTime;
    //任务处理耗时
    private long durationInMillis;
    //任务处理状态
    private String status;
    //任务受理人
    private String assignee;
    
    private String startTimeStr;
    
    private String endTimeStr;
    
    private String durationInMillisStr;
    //退回原因
    private String reason;
    
    private static DateConverter dateConvert = new DateConverter();
    
	public String getTaskName() {
		return taskName;
	}
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}
	public long getStartTime() {
		return startTime;
	}
	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}
	public long getEndTime() {
		return endTime;
	}
	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}
	public long getDurationInMillis() {
		return durationInMillis;
	}
	public void setDurationInMillis(long durationInMillis) {
		this.durationInMillis = durationInMillis;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getAssignee() {
		return assignee;
	}
	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}
	public String getStartTimeStr() {
		return dateConvert.doConvertToString(dateConvert.mili2Date(startTime));
	}
	
	public String getEndTimeStr() {
		return dateConvert.doConvertToString(dateConvert.mili2Date(endTime));
	}
	
	public String getDurationInMillisStr() {
		if(durationInMillis != 0){
			return String.valueOf(durationInMillis/1000/3600);
		}
		else
		{
			return "0";
		}
	}
	
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	
	

	

}
