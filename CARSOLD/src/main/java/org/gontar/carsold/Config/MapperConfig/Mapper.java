package org.gontar.carsold.Config.MapperConfig;

public interface Mapper <A, B>{
    B mapToDto(A a);
    A mapToEntity(B b);
}
