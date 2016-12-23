package com.auth.menu;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.auth.menu.dto.MenuDto;
import com.auth.menu.service.MenuService;
import com.myplatform.common.utils.Constants;

@Controller
@RequestMapping("auth/menu")
public class MenuController {

	@Autowired
	private MenuService menuService;
	
	/**
	 * 功能: 获取级联菜单
	 * 作者: chaoxu-yao
	 * 创建日期:2016年11月8日 下午3:15:26
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/menus")
	public List<MenuDto> getCascadeMenu(){
		String applicationId = Constants.APP_ID;
		return menuService.getCascadeMenu(applicationId);
	}
	
}
