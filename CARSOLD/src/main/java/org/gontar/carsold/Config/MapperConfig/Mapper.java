package org.gontar.carsold.Config.MapperConfig;

public interface Mapper <A, B>{
    A mapToEntity(B b);
    B mapToDto(A a);
}