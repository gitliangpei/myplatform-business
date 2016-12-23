package com.security.realm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cas.CasRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;

import com.auth.dto.Role;
import com.auth.dto.RolePermission;
import com.auth.utils.AuthHelper;
import com.myplatform.common.utils.Constants;

/**
 * 
 * 创建日期:2016年10月14日
 * Title:自定义realm
 * Description：对本文件的详细描述，原则上不能少于30字
 * @author lp
 * @mender：（文件的修改者，文件创建者之外的人）
 * @version 1.0
 * Remark：认为有必要的其他信息
 */
public class MyCasRealm extends CasRealm {
	
	public static SimpleAuthorizationInfo authorizationInfo;

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
    	
//    	if(authorizationInfo != null){
//    		return authorizationInfo;
//    	}
    	
    	Subject current = SecurityUtils.getSubject();
    	
    	//1.查找当前用户拥有的权限
    	String username = (String)principals.getPrimaryPrincipal();
		
    	List<Role> roleList = null;
    	List<RolePermission> permissionList = null;
    	
    	PrincipalCollection principal = current.getPrincipals();
		Map<String,String> attributes = new HashMap<String,String>();
		if(null != principal){
			attributes = (Map<String,String>) principal.asList().get(1);
			//1.1读取角色id集合
			String roleIds = attributes.get("roles");
			
			//1.2依据角色id，查找角色对象
			roleList = AuthHelper.findAllRoles(roleIds);
			
			//1.3依据角色id，查找对应权限
			permissionList = AuthHelper.findPermisByRoleIds(roleIds);
			
		}
		
    	//2.将权限存储到shiro
        authorizationInfo = new SimpleAuthorizationInfo();
        //2.1添加角色
        Set<String> role = new HashSet<String>();
        if(roleList != null){
        	for(Role r : roleList){
        		//如果是本系统的超级管理员
        		if("admin".equals(r.getRoleCode())){
        			String appId = Constants.APP_ID;
        			role.add(appId + ":admin");
        			break;
        		}
        		
        		role.add(r.getRoleCode());
        	}
        }  
        //添加默认角色
        role.add("default");
        authorizationInfo.setRoles(role);
        
        //2.2添加权限
        Set<String> permissions = new HashSet<String>();
        if(permissionList != null){
        	for(RolePermission p : permissionList){
        		permissions.add(p.getResourceId()+":"+p.getPermissionId());
        	}
        }
        
        permissions.add("crud:auth-create");
        authorizationInfo.setStringPermissions(permissions);

        return authorizationInfo;
    }
    
    /**
     * 
     * 功能:清除缓存
     * 作者: lp
     * 创建日期:2016年12月1日
     */
    public void clearCached() {
        PrincipalCollection principals = SecurityUtils.getSubject().getPrincipals();
        super.clearCache(principals);
    }
}
