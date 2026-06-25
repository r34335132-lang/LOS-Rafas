import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

export default function PlayerCredentialRedirect() {
  const { playerId } = useLocalSearchParams<{ playerId?: string }>();
  return <Redirect href={playerId ? `/player/${playerId}` : "/sports?sport=soccer"} />;
}
