package com.whiskeygallery_review.review_api.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "other_review")
public class OtherReview extends BaseReview {
    private String category;
}
