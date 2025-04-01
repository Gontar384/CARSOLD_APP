package org.gontar.carsold.Service.OfferService.SearchService;

import jakarta.persistence.criteria.Expression;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.OfferFilterDto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import jakarta.persistence.criteria.Predicate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class OfferSpecifications {

    public Specification<Offer> withFilters(OfferFilterDto filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.getPhrase() != null && !filter.getPhrase().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + filter.getPhrase().toLowerCase() + "%"));
            }
            if (filter.getBrand() != null && !filter.getBrand().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("brand"), filter.getBrand()));
            }
            if (filter.getModel() != null && !filter.getModel().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("model"), filter.getModel()));
            }
            if (filter.getBodyType() != null && !filter.getBodyType().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("bodyType"), filter.getBodyType()));
            }
            if (filter.getMinPrice() != null) {
                BigDecimal minPrice = BigDecimal.valueOf(filter.getMinPrice());
                Expression<BigDecimal> priceExpression = criteriaBuilder.selectCase()
                        .when(criteriaBuilder.equal(root.get("currency"), "EUR"),
                                criteriaBuilder.prod(root.get("price").as(BigDecimal.class), BigDecimal.valueOf(4)))
                        .otherwise(root.get("price").as(BigDecimal.class))
                        .as(BigDecimal.class);
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(priceExpression, minPrice));
            }
            if (filter.getMaxPrice() != null) {
                BigDecimal maxPrice = BigDecimal.valueOf(filter.getMaxPrice());
                Expression<BigDecimal> priceExpression = criteriaBuilder.selectCase()
                        .when(criteriaBuilder.equal(root.get("currency"), "EUR"),
                                criteriaBuilder.prod(root.get("price").as(BigDecimal.class), BigDecimal.valueOf(4)))
                        .otherwise(root.get("price").as(BigDecimal.class))
                        .as(BigDecimal.class);
                predicates.add(criteriaBuilder.lessThanOrEqualTo(priceExpression, maxPrice));
            }
            if (filter.getMinYear() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("year"), filter.getMinYear()));
            }
            if (filter.getMaxYear() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("year"), filter.getMaxYear()));
            }
            if (filter.getFuel() != null && !filter.getFuel().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("fuel"), filter.getFuel()));
            }
            if (filter.getMinMileage() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("mileage"), filter.getMinMileage()));
            }
            if (filter.getMaxMileage() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("mileage"), filter.getMaxMileage()));
            }
            if (filter.getColor() != null && !filter.getColor().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("color"), filter.getColor()));
            }
            if (filter.getTransmission() != null && !filter.getTransmission().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("transmission"), filter.getTransmission()));
            }
            if (filter.getMinPower() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("power"), filter.getMinPower()));
            }
            if (filter.getMaxPower() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("power"), filter.getMaxPower()));
            }
            if (filter.getMinCapacity() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("capacity"), filter.getMinCapacity()));
            }
            if (filter.getMaxCapacity() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("capacity"), filter.getMaxCapacity()));
            }
            if (filter.getDrive() != null && !filter.getDrive().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("drive"), filter.getDrive()));
            }
            if (filter.getCondition() != null && !filter.getCondition().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("condition"), filter.getCondition()));
            }
            if (filter.getSeats() != null) {
                predicates.add(criteriaBuilder.equal(root.get("seats"), filter.getSeats()));
            }
            if (filter.getDoors() != null) {
                predicates.add(criteriaBuilder.equal(root.get("doors"), filter.getDoors()));
            }
            if (query != null) {
                if (filter.getSortBy() == null || filter.getSortBy().equals("Oldest")) {
                    query.orderBy(criteriaBuilder.asc(
                            criteriaBuilder.function("TO_DATE", LocalDate.class,
                                    root.get("createdOn"),
                                    criteriaBuilder.literal("dd/MM/yyyy"))
                    ));
                } else if (filter.getSortBy().equals("Newest")) {
                    query.orderBy(criteriaBuilder.desc(
                            criteriaBuilder.function("TO_DATE", LocalDate.class,
                                    root.get("createdOn"),
                                    criteriaBuilder.literal("dd/MM/yyyy"))
                    ));
                } else if (filter.getSortBy().equals("Most popular")) {
                    query.orderBy(criteriaBuilder.desc(root.get("views")));
                } else if (filter.getSortBy().equals("Least popular")) {
                    query.orderBy(criteriaBuilder.asc(root.get("views")));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}