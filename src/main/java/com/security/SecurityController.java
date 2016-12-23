/**
 * Copyright(c)2008 Beijing ieforever Co. Ltd.
 * All right reserved.
 * 项目名称:工程管理项目
 * 创建日期:2016年10月9日
 */

package com.security;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.auth.utils.AuthHelper;
import com.myplatform.common.utils.Constants;
import com.myplatform.common.utils.ReadProperties;
import com.security.realm.MyCasRealm;

/**
 * 创建日期:2016年10月9日
 * Title:文件所属模块（必须填写）
 * Description：对本文件的详细描述，原则上不能少于30字
 * @author lp
 * @mender：（文件的修改者，文件创建者之外的人）
 * @version 1.0
 * Remark：认为有必要的其他信息
 */
@Controller
@RequestMapping("security")
public class SecurityController {
	
	@Autowired
	private MyCasRealm myCasRealm;

	/**
	 * 
	 * 功能:用户注销
	 * 作者: lp
	 * 创建日期:2016年10月12日
	 * @param session
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/logout")
    public String logout(HttpSession session,HttpServletRequest request) {
		//清除session和授权信息
		session.invalidate();
		//清除缓存
		myCasRealm.clearCached();
				
		String casServer = ReadProperties.getKey("cas.server");
		String path = request.getContextPath();
	    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
        return "redirect:"+casServer+"/logout?service="+basePath+"/app/index.html";
    }
	
	/**
	 * 
	 * 功能:获取登录用户属性信息
	 * 作者: lp
	 * 创建日期:2016年10月12日
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/loginAttr")
	public Map<String,String> loginAttr() {
		PrincipalCollection principal = SecurityUtils.getSubject().getPrincipals();
		Map<String,String> attributes = new HashMap<String,String>();
		if(null != principal){
			attributes = (Map<String,String>) principal.asList().get(1);
		}
		
		return attributes;
	}
	
	/**
	 * 
	 * 功能:获取登录用户名
	 * 作者: lp
	 * 创建日期:2016年10月12日
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/loginName")
	public String loginName() {
		PrincipalCollection principal = SecurityUtils.getSubject().getPrincipals();
		String username = "";
		if(null != principal){
			username = (String)principal.asList().get(0);
		}
		
		return username;
	}
	@ResponseBody
	@RequestMapping(value = "/loginAuth")
	public void loginAuth() {
		PrincipalCollection principal = SecurityUtils.getSubject().getPrincipals();
		//显式调用验证，为了调用自定义realm中的doGetAuthorizationInfo，达到初始化权限目的
		SecurityUtils.getSubject().hasRole("role1");
	}
	/**
	 * 
	 * 功能:获取登录用户在指定功能中没有的权限字
	 * 作者: lp
	 * 创建日期:2016年10月12日
	 * @param authCode  功能编码
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/noAllowedAuth")
	public String[] noAllowedAuth(@RequestParam(value = "resCode", required = true) String resCode) {
		
		// 1.判断当前用户，是否拥有当前系统管理员角色，如果有，返回空数组
				String appId = Constants.APP_ID;
				if (SecurityUtils.getSubject().hasRole(appId + ":admin")) {
					return new String[] { "" };
				}

				// 2.查找resCode对应功能的权限字
				ArrayList<String> permisCodesLst = AuthHelper.getPermissionCodesStrByResCode(resCode);

				// 3.过滤出当前登录用户没有权限的权限字
				String resPermisStr = "";
				boolean flag = false;
				// 用于保存用户拥有的权限字
				ArrayList<String> noHaveCodes = new ArrayList<String>();
				Subject currenUser = SecurityUtils.getSubject();
				// 遍历所有权限字，将用户没有的权限字保存到list
				for (String code : permisCodesLst) {
					resPermisStr = resCode + ":" + code;
					flag = currenUser.isPermitted(resPermisStr);
					if (!flag) {
						noHaveCodes.add(code);
					}
				}
				// 将list变成数组
				String[] auth = noHaveCodes.toArray(new String[noHaveCodes.size()]); 

				return auth;
	}
	
}
