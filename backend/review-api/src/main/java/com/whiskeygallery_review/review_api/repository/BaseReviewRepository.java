package com.whiskeygallery_review.review_api.repository;

import com.whiskeygallery_review.review_api.entity.BaseReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

@NoRepositoryBean
public interface BaseReviewRepository<T extends BaseReview>
        extends JpaRepository<T, Long>, QuerydslPredicateExecutor<T>, BaseReviewCustomRepository<T>
{
}
