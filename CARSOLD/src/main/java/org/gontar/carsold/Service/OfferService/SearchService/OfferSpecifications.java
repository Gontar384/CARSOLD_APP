package org.gontar.carsold.Service.OfferService.SearchService;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.OfferFilterDto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Component
public class OfferSpecifications {

    public Specification<Offer> withFilters(OfferFilterDto filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

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
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
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
            if (predicates.isEmpty() && query != null){
                query.orderBy(criteriaBuilder.asc(criteriaBuilder.function("RANDOM", Double.class)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}