export type ServiceType = "REGULER" | "EXPRESS";

const PRICE_PER_KG: Record<ServiceType, number> = {
  REGULER: 7000,
  EXPRESS: 10000,
};

export function calculatePrice(
  serviceType: ServiceType,
  weightKg: number
): number {
  if (!weightKg || weightKg <= 0) {
    throw new Error("Berat tidak valid");
  }

  return PRICE_PER_KG[serviceType] * weightKg;
}

