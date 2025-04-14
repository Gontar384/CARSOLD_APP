package org.gontar.carsold.Domain.Model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CitySuggestionsDto {
    private List<String> citySuggestions;
}
