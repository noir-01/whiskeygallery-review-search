package com.whiskeygallery_review.review_api.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.whiskeygallery_review.review_api.entity.BaseReview;
import com.whiskeygallery_review.review_api.repository.BaseReviewCustomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

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

//    @Override
//    public Page<T> searchWithPaging(List<String> andWords, List<String> orWords, String age, String nickname, Pageable pageable) {
//        BooleanBuilder builder = new BooleanBuilder();
//
//        if (age != null && !age.isEmpty()) {
//            builder.and(titlePath.containsIgnoreCase(age));
//        }
//        if (nickname != null && !nickname.isEmpty()) {
//            builder.and(nicknamePath.eq(nickname));
//        }
//        if (andWords != null && !andWords.isEmpty()) {
//            andWords.forEach(word -> builder.and(titlePath.containsIgnoreCase(word)));
//        }
//        if (orWords != null && !orWords.isEmpty()) {
//            BooleanBuilder orBuilder = new BooleanBuilder();
//            orWords.forEach(word -> orBuilder.or(titlePath.containsIgnoreCase(word)));
//            builder.and(orBuilder);
//        }
//
//        List<OrderSpecifier<?>> orders = new ArrayList<>();
//        pageable.getSort().forEach(order -> {
//            PathBuilder<?> pathBuilder = new PathBuilder<>(entityPath.getType(), entityPath.getMetadata());
//            String property = order.getProperty();
//
//            // Get the property path with explicit type
//            Path<?> propertyPath = pathBuilder.get(property);
//
//            // Create OrderSpecifier with proper type casting
//            OrderSpecifier<?> orderSpecifier = order.isAscending() ?
//                    new OrderSpecifier(Order.ASC, propertyPath) :
//                    new OrderSpecifier(Order.DESC, propertyPath);
//
//            orders.add(orderSpecifier);
//        });
//
//        // QueryDSL 쿼리에서 정렬 적용
//        JPAQuery<T> query = queryFactory.selectFrom(entityPath)
//                .where(builder)
//                .offset(pageable.getOffset())
//                .limit(pageable.getPageSize());
//
//        if (!orders.isEmpty()) {
//            query.orderBy(orders.toArray(new OrderSpecifier[0]));
//        }
//
//        // 데이터 조회
//        List<T> content = query.fetch();
//
//        // 총 개수 조회
//        long total = queryFactory.selectFrom(entityPath)
//                .where(builder)
//                .fetchCount();
//
//        return new PageImpl<>(content, pageable, total);
//    }
private String sanitizeMroongaSearchTerm(String term) {
    if (term == null || term.isEmpty()) {
        return "";
    }
    // 큰따옴표 자체를 이스케이프 (큰따옴표 두 개로 변경)
    String escapedTerm = term.replace("\"", "\"\"");
    // 공백이나 Mroonga 연산자를 포함하면 전체를 큰따옴표로 묶음
    if (term.contains(" ") || term.matches(".*[+\\-*\"()<>@].*")) {
        return "\"" + escapedTerm + "\"";
    }
    return escapedTerm;
}

    private String buildMroongaQuery(List<String> andWords, List<String> orWords, String ageKeyword) {
        List<String> queryParts = new ArrayList<>();

        // ageKeyword는 AND 조건으로 titlePath에 대해 검색
        if (StringUtils.hasText(ageKeyword)) {
            queryParts.add("+" + sanitizeMroongaSearchTerm(ageKeyword.trim()));
        }

        // andWords 처리 (각 단어는 AND 조건)
        if (andWords != null && !andWords.isEmpty()) {
            for (String word : andWords) {
                if (StringUtils.hasText(word)) {
                    queryParts.add("+" + sanitizeMroongaSearchTerm(word.trim()));
                }
            }
        }

        // orWords 처리 (단어 그룹은 OR 조건)
        if (orWords != null && !orWords.isEmpty()) {
            List<String> sanitizedOrWords = orWords.stream()
                    .filter(StringUtils::hasText)
                    .map(word -> sanitizeMroongaSearchTerm(word.trim()))
                    .toList();

            if (!sanitizedOrWords.isEmpty()) {
                // AND 조건이 있거나, OR 단어가 여러 개일 경우 괄호로 묶어 명확한 OR 그룹을 만듭니다.
                // 예: +term1 +term2 (orTermA orTermB)
                // Mroonga는 기본적으로 공백을 OR로 해석하지만, + 연산자와 함께 사용할 때 명시적 그룹핑이 안전합니다.
                // 이미 다른 조건이 있거나 OR 단어가 존재하면
                queryParts.add("(" + String.join(" ", sanitizedOrWords) + ")");
                // 만약 AND 조건 없이 OR 조건만 있고, OR 단어가 하나라면 괄호 없이 추가할 수도 있습니다.
                // else if (sanitizedOrWords.size() == 1) {
                //    queryParts.add(sanitizedOrWords.get(0));
                // }
            }
        }
        return String.join(" ", queryParts).trim();
    }


    @Override
    public Page<T> searchWithPaging(List<String> andWords, List<String> orWords, String age, String nickname, Pageable pageable) {
        BooleanBuilder builder = new BooleanBuilder();

        // Mroonga full-text search 쿼리 생성
        String mroongaSearchQuery = buildMroongaQuery(andWords, orWords, age);

        if (StringUtils.hasText(mroongaSearchQuery)) {
            // MATCH (column) AGAINST ('query' IN BOOLEAN MODE)
            // 여기서 titlePath는 full-text index가 생성된 컬럼이어야 합니다.
            // 여러 컬럼을 검색하려면 "MATCH(col1, col2) AGAINST(...)" 형태로 사용합니다.
            // 예: Expressions.booleanTemplate("MATCH({0}, {1}) AGAINST ({2} IN BOOLEAN MODE)", titlePath, contentPath, Expressions.constant(mroongaSearchQuery))
            BooleanExpression mroongaPredicate = Expressions.booleanTemplate(
                    "MATCH({0}) AGAINST ({1} IN BOOLEAN MODE)",
                    this.titlePath, // 검색 대상 컬럼 (title)
                    Expressions.constant(mroongaSearchQuery) // Mroonga 검색어
            );
            builder.and(mroongaPredicate);
        }

        // 일반적인 nickname 검색 (Mroonga와 별개)
        if (StringUtils.hasText(nickname)) {
            builder.and(nicknamePath.eq(nickname));
        }

        // 정렬 처리
        List<OrderSpecifier<?>> orders = new ArrayList<>();
        if (pageable.getSort().isSorted()) {
            pageable.getSort().forEach(order -> {
                PathBuilder<T> pathBuilder = new PathBuilder<>(entityPath.getType(), entityPath.getMetadata());
                Path<?> propertyPath = pathBuilder.get(order.getProperty(), Object.class); // 타입을 명시적으로 지정

                orders.add(new OrderSpecifier(order.isAscending() ? Order.ASC : Order.DESC, propertyPath));
            });
        } else {
            // Mroonga 검색 시 관련도 순 정렬이 기본일 수 있으나, 명시적 정렬이 없으면 기본 정렬 (예: ID) 또는 DB 기본값을 따름
            // 필요시 기본 정렬 추가: orders.add(new OrderSpecifier(Order.DESC, pathBuilder.get("id")));
            // Mroonga의 스코어 기반 정렬을 사용하려면:
            // JPAQuery 에 .orderBy(Expressions.numberTemplate(Double.class, "MATCH({0}) AGAINST ({1})", titlePath, Expressions.constant(mroongaSearchQueryWithoutBooleanMode)).desc())
            // 와 같이 스코어 함수를 직접 호출해야 할 수 있습니다. 이는 더 복잡하며, 여기서는 요청된 페이징 정렬만 처리합니다.
        }


        JPAQuery<T> query = queryFactory.selectFrom(entityPath)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        if (!orders.isEmpty()) {
            query.orderBy(orders.toArray(new OrderSpecifier[0]));
        }

        List<T> content = query.fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(Wildcard.count) // COUNT(*)
                .from(entityPath)
                .where(builder);

        Long total = countQuery.fetchOne();
        if (total == null) {
            total = 0L;
        }

        return new PageImpl<>(content, pageable, total);
    }
}

