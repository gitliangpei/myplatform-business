package com.myplatform.example.crud.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.myplatform.example.crud.dto.CrudDto;
import com.myplatform.example.crud.entity.Crud;
import com.myplatform.example.crud.repository.CrudRepository;
import com.myplatform.example.crud.service.CrudService;
import com.myplatform.query.dto.EZPageDto;
import com.myplatform.query.dto.EZQueryDto;
import com.myplatform.query.service.PageService;
import com.myplatform.query.utils.SearchGenerator;


@Service
public class CrudServiceImpl extends PageService implements CrudService {

	@Autowired
	private CrudRepository crudRepository;
	
	public List<Crud> getGrapTextGroupsbyTypes(String groupType) {
		List<Crud> gtgList= crudRepository.getGrapTextGroupsByGroupType(groupType);
		return gtgList;
	}
	

	/* 根据id查询项目 */
	public Crud getById(String id) {
		Crud gtg = crudRepository.getCrudById(id);
		return gtg;
	}
	

	@Override
	public EZPageDto findAllByEZQuery(EZQueryDto queryDto) throws IOException{
		super.buildCondition(queryDto);
		Specification<Crud> specification=new SearchGenerator().getSpecification(searchConditions);
		Page<Crud> page=crudRepository.findAll(specification,pRequest);
		EZPageDto dto=new EZPageDto();
		ArrayList<Object> data=new ArrayList<Object>(page.getContent());
		dto.setTotal(page.getTotalElements()+"");
		dto.setRows(data);
		return dto;
	}
	
	
	/* 保存项目 */
	@Transactional
	public boolean save(CrudDto dto) {
		 if (dto != null && dto.getCrud() != null) {
			if (dto.getCrud().getId() == "") {
				dto.getCrud().setId(UUID.randomUUID().toString());
			}
			dto.getCrud().setCreateDate(new Date());
			dto.getCrud().setUpdateDate(new Date());
			dto.getCrud().setDelFlag("0");
			crudRepository.save(dto.getCrud());
			
			return true;
		} else {
			
			return false;
		}
	}
	
	//删除草稿
	@Override
	public boolean delete(String id) {
		crudRepository.deleteCrudById(id);
		return true;
	}
	
	
}
