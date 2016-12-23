package com.auth.menu.dto;

import java.util.List;

import com.auth.menu.entity.Menu;

public class MenuDto {

	/**
	 * 本身
	 */
	private Menu menu;
	/**
	 * 子菜单
	 */
	private List<Menu> children;

	public Menu getMenu() {
		return menu;
	}

	public void setMenu(Menu menu) {
		this.menu = menu;
	}

	public List<Menu> getChildren() {
		return children;
	}

	public void setChildren(List<Menu> children) {
		this.children = children;
	}

}
