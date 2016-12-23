package com.auth.menu.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Service;

import com.auth.menu.dto.MenuDto;
import com.auth.menu.entity.Menu;
import com.auth.menu.service.MenuService;
import com.auth.utils.AuthHelper;
import com.myplatform.query.service.PageService;

@Service
public class MenuServiceImpl extends PageService implements MenuService {
	
	@Override
	public List<MenuDto> getCascadeMenu(String applicationId) {
		//1.读取数据库中，当前系统的菜单树
		//定义
		MenuDto dto = null;
		List<MenuDto> dtos = new ArrayList<MenuDto>();
		//获取根菜单
		Menu rootMenu = AuthHelper.findRoot(applicationId);
		if(rootMenu == null){
			return dtos;
		}
		
		
		//2.角色验证
		Subject currentAuth = SecurityUtils.getSubject();
		//2.1验证当前用户是否为当前系统超级管理,如果是超级管理员，直接返回所有菜单
		
		
		//3.逐级过滤，当前用户有权限的菜单
		
		//获取根菜单的下一级,二级菜单
		List<Menu> secondMenus = AuthHelper.findByParentId(rootMenu.getId());
		//循环二级菜单，获取三级菜单
		for (Menu sm : secondMenus) {
			dto = new MenuDto();
			List<Menu> thirdMenusAll = AuthHelper.findByParentId(sm.getId());
			List<Menu> thirdMenus = new ArrayList<Menu>();
			//如果是超级管理员，加载全部菜单
			if(currentAuth.hasRole(applicationId + ":admin")){
				thirdMenus = thirdMenusAll;
			}
			else
			{
				for(Menu tm : thirdMenusAll){
					//判断有权限的，添加到菜单中
					String[] permisson = tm.getPermissionCode().split(",");
					for(String p : permisson){
						if(currentAuth.isPermitted(p) && !thirdMenus.contains(tm)){
							thirdMenus.add(tm);
						}
					}
				}
			}
			//子集菜单不为空，再添加
			if(!thirdMenus.isEmpty()){
				dto.setChildren(thirdMenus);
				dto.setMenu(sm);
				dtos.add(dto);
			}
			
		}
		
		return dtos;
	}
}
