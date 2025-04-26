package com.whiskeygallery_review.review_api.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.whiskeygallery_review.review_api.entity.BaseReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

public class BaseReviewCustomRepositoryImpl<T extends BaseReview> implements BaseReviewCustomRepository<T> {

    private final JPAQueryFactory queryFactory;
    private final EntityPath<T> entityPath;
    private final StringPath titlePath;
    private final StringPath nicknamePath;

    public BaseReviewCustomRepositoryImpl(JPAQueryFactory queryFactory, EntityPath<T> entityPath, StringPath titlePath, StringPath nicknamePath) {
        this.queryFactory = queryFactory;
        this.entityPath = entityPath;
        this.titlePath = titlePath;
        this.nicknamePath = nicknamePath;
    }

    @Override
    public Page<T> searchWithPaging(List<String> andWords, List<String> orWords, String age, String nickname, Pageable pageable) {
        BooleanBuilder builder = new BooleanBuilder();

        if (age != null && !age.isEmpty()) {
            builder.and(titlePath.containsIgnoreCase(age));
        }
        if (nickname != null && !nickname.isEmpty()) {
            builder.and(nicknamePath.eq(nickname));
        }
        if (andWords != null && !andWords.isEmpty()) {
            andWords.forEach(word -> builder.and(titlePath.containsIgnoreCase(word)));
        }
        if (orWords != null && !orWords.isEmpty()) {
            BooleanBuilder orBuilder = new BooleanBuilder();
            orWords.forEach(word -> orBuilder.or(titlePath.containsIgnoreCase(word)));
            builder.and(orBuilder);
        }

        List<OrderSpecifier<?>> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> {
            PathBuilder<?> pathBuilder = new PathBuilder<>(entityPath.getType(), entityPath.getMetadata());
            String property = order.getProperty();

            // Get the property path with explicit type
            Path<?> propertyPath = pathBuilder.get(property);

            // Create OrderSpecifier with proper type casting
            OrderSpecifier<?> orderSpecifier = order.isAscending() ?
                    new OrderSpecifier(Order.ASC, propertyPath) :
                    new OrderSpecifier(Order.DESC, propertyPath);

            orders.add(orderSpecifier);
        });

        // QueryDSL 쿼리에서 정렬 적용
        JPAQuery<T> query = queryFactory.selectFrom(entityPath)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        if (!orders.isEmpty()) {
            query.orderBy(orders.toArray(new OrderSpecifier[0]));
        }

        // 데이터 조회
        List<T> content = query.fetch();

        // 총 개수 조회
        long total = queryFactory.selectFrom(entityPath)
                .where(builder)
                .fetchCount();

        return new PageImpl<>(content, pageable, total);
    }
}

