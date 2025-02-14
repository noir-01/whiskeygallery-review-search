package com.whiskeygallery_review.review_api.repository;
import com.whiskeygallery_review.review_api.entity.WhiskeyReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WhiskeyReviewRepository extends JpaRepository<WhiskeyReview, Integer> {
}