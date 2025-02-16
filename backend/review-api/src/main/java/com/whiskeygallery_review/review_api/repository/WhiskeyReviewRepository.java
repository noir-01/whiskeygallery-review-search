package com.whiskeygallery_review.review_api.repository;
import com.querydsl.core.BooleanBuilder;
import com.whiskeygallery_review.review_api.entity.QWhiskeyReview;
import com.whiskeygallery_review.review_api.entity.WhiskeyReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WhiskeyReviewRepository extends JpaRepository<WhiskeyReview, Long>,
        QuerydslPredicateExecutor<WhiskeyReview> {
    List<WhiskeyReview> findByTitleContaining(String keyword);

    default Page<WhiskeyReview> searchWithPaging(
            List<String> andWords,
            List<String> orWords,
            String age,
            String nickname,
            Pageable pageable) {

        QWhiskeyReview review = QWhiskeyReview.whiskeyReview;
        BooleanBuilder builder = new BooleanBuilder();

        // age
        if (age!=null && !age.isEmpty()){
            builder.and(review.title.containsIgnoreCase(age));
        }

        // 닉네임 조건
        if (nickname != null && !nickname.isEmpty()) {
            builder.and(review.nickname.eq(nickname));
        }

        // AND 키워드 조건
        if (andWords != null && !andWords.isEmpty()) {
            andWords.forEach(word -> builder.and(review.title.containsIgnoreCase(word)));
        }

        // OR 키워드 조건
        if (orWords != null && !orWords.isEmpty()) {
            BooleanBuilder orBuilder = new BooleanBuilder();
            orWords.forEach(word -> orBuilder.or(review.title.containsIgnoreCase(word)));
            builder.and(orBuilder);
        }
        System.out.println(builder.getValue());

        return findAll(builder, pageable);
    }
}