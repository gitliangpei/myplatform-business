/**
 * 创建日期:2014-10-11
 */

package com.workflow.example.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 
 * 创建日期:2016年11月22日
 * Title:请假实体
 * Description：对本文件的详细描述，原则上不能少于30字
 * @author lp
 * @mender：（文件的修改者，文件创建者之外的人）
 * @version 1.0
 * Remark：认为有必要的其他信息
 */
@Table(name = "OA_LEAVE")
@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Leave {
	
	private String id;
	private String processInstanceId;
    private String userId;

    private String startTime;

    private String endTime;

    private String realityStartTime;

    private String realityEndTime;
    private String applyTime;
    private String leaveType;
    private String reason;
    
    @Id
	@Column(name = "id")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	@Column(name = "PROCESS_INSTANCE_ID")
	public String getProcessInstanceId() {
		return processInstanceId;
	}
	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}
	
	@Column(name = "USER_ID")
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	@Column(name = "START_TIME")
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	
	@Column(name = "END_TIME")
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
	@Column(name = "REALITY_START_TIME")
	public String getRealityStartTime() {
		return realityStartTime;
	}
	public void setRealityStartTime(String realityStartTime) {
		this.realityStartTime = realityStartTime;
	}
	
	@Column(name = "REALITY_END_TIME")
	public String getRealityEndTime() {
		return realityEndTime;
	}
	public void setRealityEndTime(String realityEndTime) {
		this.realityEndTime = realityEndTime;
	}
	
	@Column(name = "APPLY_TIME")
	public String getApplyTime() {
		return applyTime;
	}
	public void setApplyTime(String applyTime) {
		this.applyTime = applyTime;
	}
	
	@Column(name = "LEAVE_TYPE")
	public String getLeaveType() {
		return leaveType;
	}
	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
	}
	
	@Column(name = "REASON")
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	
	
	
}
