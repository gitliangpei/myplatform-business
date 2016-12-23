/**
 * Copyright(c)2008 Beijing ieforever Co. Ltd.
 * All right reserved.
 * 项目名称:工程管理项目
 * 创建日期:2016年11月28日
 */

package com.auth.utils;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.auth.dto.Role;
import com.auth.dto.RolePermission;
import com.auth.menu.entity.Menu;
import com.myplatform.common.utils.Constants;
import com.workflow.activiti.utils.HttpClient;

/**
 * 创建日期:2016年11月28日 上午11:21:19
 * Description: 
 * @author chaoxu-yao
 * @mender：（修改者，创建者之外的人）
 * @version 1.0
 * Remark：（备注信息）
 */
public class AuthHelper {

	/**
	 * 功能: 根据资源编码获取权限编码list
	 * 作者: chaoxu-yao
	 * 创建日期:2016年11月28日 下午2:19:07
	 * @param resCode
	 * @return
	 */
	public static ArrayList<String> getPermissionCodesStrByResCode(String resCode){
		//流程实例id查询历史
		HttpClient client = new HttpClient();
		String url = Constants.AUTH_URL + "/rest/auth/permissionCodes/permiscodes?resCode=" + resCode + "&random="+Math.random();
		String json = client.get(url);
		ArrayList<String> list = (ArrayList<String>) JSON.parseArray(json, String.class); 
		
		return list;
	}
	/**
	 * 功能: 根据角色id集合批量获取角色
	 * 作者: chaoxu-yao
	 * 创建日期:2016年11月28日 下午2:42:45
	 * @param ids
	 * @return
	 */
	public static List<Role> findAllRoles(String ids) {
		HttpClient client = new HttpClient();
		String url = Constants.AUTH_URL + "/rest/auth/role/allRoles?ids=" + ids + "&random="+Math.random();
		String json = client.get(url);
		List<Role> list = JSON.parseArray(json, Role.class); 
		
		return list;
	}
	
	public static List<RolePermission> findPermisByRoleIds(String roleIds) {
		HttpClient client = new HttpClient();
		String url = Constants.AUTH_URL + "/rest/auth/rolePermission/listPermission?ids=" + roleIds + "&random="+Math.random();
		String json = client.get(url);
		List<RolePermission> list = JSON.parseArray(json, RolePermission.class); 
		
		return list;
	}
	
	public static Menu findRoot(String applicationId) {
		HttpClient client = new HttpClient();
		String url = Constants.AUTH_URL + "/rest/auth/menu/root?applicationId=" + applicationId + "&random="+Math.random();
		String json = client.get(url);
		Menu menu = JSON.parseObject(json, Menu.class); 
		
		return menu;
	}
	
	public static List<Menu> findByParentId(String parentId) {
		HttpClient client = new HttpClient();
		String url = Constants.AUTH_URL + "/rest/auth/menu/parent?parentId=" + parentId + "&random="+Math.random();
		String json = client.get(url);
		List<Menu> list = JSON.parseArray(json, Menu.class); 
		
		return list;
	}
}
