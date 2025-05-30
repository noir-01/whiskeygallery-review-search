package com.whiskeygallery_review.review_api.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "whiskey_review")
public class WhiskeyReview extends BaseReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private Integer recom;
    private Integer reply;
    private LocalDate postDate;
    private String nickname;
}
//public class WhiskeyReview{

