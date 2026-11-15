import {
  AirplaneIcon,
  AirplaneTakeoffIcon,
  BedIcon,
  FirstAidKitIcon,
  ForkKnifeIcon,
  MapTrifoldIcon,
  ShoppingBagIcon,
  TrainIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import type { SituationIconKey } from "../data/situations";

const icons: Record<SituationIconKey, ComponentType<{ size?: number }>> = {
  airport: AirplaneTakeoffIcon,
  plane: AirplaneIcon,
  hotel: BedIcon,
  cafe: ForkKnifeIcon,
  city: MapTrifoldIcon,
  transport: TrainIcon,
  shop: ShoppingBagIcon,
  emergency: FirstAidKitIcon,
};

/** Иконка ситуации на плитке с фоном Surface/Selected. Один вес линии на весь сайт. */
export default function SituationIcon({
  name,
  size = 24,
}: {
  name: SituationIconKey;
  size?: number;
}) {
  const Icon = icons[name];
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-selected text-info">
      <Icon size={size} />
    </span>
  );
}
