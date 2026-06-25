import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { CardTemplate } from "@/lib/types";

export function CardTemplateSelector({
  templates,
  selectedId,
  accent,
  onSelect,
}: {
  templates: CardTemplate[];
  selectedId?: string;
  accent: string;
  onSelect: (template: CardTemplate) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {templates.map((template) => {
        const selected = template.id === selectedId;
        return (
          <Pressable
            key={template.id}
            onPress={() => onSelect(template)}
            style={[styles.card, selected && { borderColor: accent, backgroundColor: `${accent}12` }]}
          >
            <MaterialCommunityIcons
              name={template.template_type === "mvp_edition" ? "trophy" : template.template_type === "rookie_card" ? "star-outline" : "cards"}
              size={24}
              color={selected ? accent : "rgba(255,255,255,0.55)"}
            />
            <Text style={[styles.name, selected && { color: accent }]}>{template.name}</Text>
            <Text style={styles.type}>{template.background_style.toUpperCase()}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 10, paddingVertical: 2 },
  card: {
    width: 142,
    minHeight: 104,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.045)",
    padding: 14,
    justifyContent: "space-between",
  },
  name: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 13, marginTop: 10 },
  type: { color: "rgba(255,255,255,0.36)", fontFamily: "Inter_700Bold", fontSize: 8, letterSpacing: 0.8, marginTop: 5 },
});
