package com.myplatform.example.crud.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import com.myplatform.example.crud.dto.CrudDto;
import com.myplatform.example.crud.entity.Crud;
import com.myplatform.query.dto.EZPageDto;
import com.myplatform.query.dto.EZQueryDto;

public interface CrudService {

	public List<Crud> getGrapTextGroupsbyTypes(String groupType);
	

	/* 根据id查询项目 */
	public Crud getById(String id);
	

	public EZPageDto findAllByEZQuery(EZQueryDto queryDto) throws IOException;
	
	
	/* 保存项目 */
	public boolean save(CrudDto dto);
	
	//删除草稿
	public boolean delete(String id);
}
