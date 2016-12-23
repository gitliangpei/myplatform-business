package com.auth.menu.service;

import java.util.List;

import com.auth.menu.dto.MenuDto;

public interface MenuService {

	/**
	 * 功能: 得到级联菜单
	 * 作者: chaoxu-yao
	 * 创建日期:2016年11月8日 下午3:00:37
	 * @return
	 */
	List<MenuDto> getCascadeMenu(String applicationId);
}
