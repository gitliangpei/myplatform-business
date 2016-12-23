package com.myplatform.example.crud.dto;
import org.springframework.stereotype.Component;

import com.myplatform.example.crud.entity.Crud;

/** 项目Dto */
@Component
public class CrudDto {
	/**
	 * 总数
	 */
	private long total;
	private Crud crud;
	
	public long getTotal() {
		return total;
	}
	public void setTotal(long total) {
		this.total = total;
	}
	public Crud getCrud() {
		return crud;
	}
	public void setCrud(Crud crud) {
		this.crud = crud;
	}	
	
	
	

}
