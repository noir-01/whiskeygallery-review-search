package com.whiskeygallery_review.review_api.dto;

import com.whiskeygallery_review.review_api.entity.OtherReview;
import com.whiskeygallery_review.review_api.entity.WhiskeyReview;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ReviewDto {
    private Integer id;
    private String title;
    private Integer recommend;
    private Integer reply;
    private String nickname;
    private LocalDate postDate;
    private String category;

    public ReviewDto(WhiskeyReview review) {
        this.id = review.getId();
        this.title = review.getTitle();
        this.recommend = review.getRecom();
        this.reply = review.getReply();
        this.nickname = review.getNickname();
        this.postDate = review.getPostDate();
        this.category = "whiskey";
    }

    public ReviewDto(OtherReview review) {
        this.id = review.getId();
        this.title = review.getTitle();
        this.recommend = review.getRecom();
        this.reply = review.getReply();
        this.nickname = review.getNickname();
        this.postDate = review.getPostDate();
        this.category = review.getCategory();
    }
}
