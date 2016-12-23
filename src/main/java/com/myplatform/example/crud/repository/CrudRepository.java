package com.myplatform.example.crud.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.myplatform.example.crud.entity.Crud;

public interface CrudRepository  extends JpaRepository<Crud, String>, JpaSpecificationExecutor<Crud> {
	
	Crud getCrudById(String id);
	
	Crud getCrudByGroupTypeAndDelFlagAndStatus(String groupType,String delFlag,String status);
	
	@Modifying
	@Transactional
	@Query(value = "Select * from WH_GRAPHIC_TEXT_group where status in ('1','2') and group_type=?1 and del_flag = '0' order by release_date desc ", nativeQuery = true)
	List<Crud> getGrapTextGroupsByGroupType(String groupType);
	
	@Override
	Page<Crud> findAll(Specification<Crud> spec, Pageable pageable);

	@Modifying
	@Transactional
	@Query(value = "update WH_GRAPHIC_TEXT_GROUP set DEL_FLAG = '1' WHERE id=?1", nativeQuery = true)
	void deleteCrudById(String id);
}
