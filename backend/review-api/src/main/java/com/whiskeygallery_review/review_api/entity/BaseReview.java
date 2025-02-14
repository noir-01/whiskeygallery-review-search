package com.whiskeygallery_review.review_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private Integer recom;
    private Integer reply;
    private String nickname;

    @Column(name = "postDate")
    private LocalDate time;
}
