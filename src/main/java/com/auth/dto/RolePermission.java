package com.auth.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 创建日期:2016年10月31日 下午10:29:01 Description: 角色与权限和资源关联类
 * 
 * @author chaoxu-yao
 * @mender：（修改者，创建者之外的人）
 * @version 1.0 Remark：（备注信息）
 */
@Table(name = "R_ROLE_PERMISSION")
@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class RolePermission {

	/**
	 * 主键
	 */
	private String id;
	/**
	 * 角色id
	 */
	private String roleId;
	/**
	 * 权限id（所属资源的子集）
	 */
	private String permissionId;
	/**
	 * 所属资源id
	 */
	private String resourceId;
	/**
	 * 显示顺序
	 */
	private int displayNum;

	@Id
	@Column(name = "id")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "roleid")
	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	@Column(name = "permissionid")
	public String getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(String permissionId) {
		this.permissionId = permissionId;
	}

	@Column(name = "resourceid")
	public String getResourceId() {
		return resourceId;
	}

	public void setResourceId(String resourceId) {
		this.resourceId = resourceId;
	}

	@Column(name = "displaynum")
	public int getDisplayNum() {
		return displayNum;
	}

	public void setDisplayNum(int displayNum) {
		this.displayNum = displayNum;
	}

}
