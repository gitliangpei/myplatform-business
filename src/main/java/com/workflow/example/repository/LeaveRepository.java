package com.workflow.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.workflow.example.entity.Leave;

public interface LeaveRepository extends JpaRepository<Leave, String>, JpaSpecificationExecutor<Leave> {

	/**
	 * 
	 * 功能:依据角色id集合，查找权限和资源关联信息
	 * 作者: lp
	 * 创建日期:2016年11月10日
	 * @param roleIds
	 * @return
	 */
	@Query(value = "SELECT O.PROCESS_INSTANCE_ID, O.USER_ID, O.START_TIME, O.END_TIME, O.APPLY_TIME, O.LEAVE_TYPE,"+ 
  " O.REASON, O.REALITY_START_TIME, O.REALITY_END_TIME, O.ID FROM OA_LEAVE O WHERE O.ID IN (?1)", nativeQuery = true)
	List<Leave> queryTask(String[] ids);
	
}
