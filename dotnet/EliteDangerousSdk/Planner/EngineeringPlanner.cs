using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using EliteDangerousSdk.Data;

namespace EliteDangerousSdk.Planner
{
    public class PlannedModification
    {
        public string ModuleGroup { get; set; } = "";
        public string BlueprintName { get; set; } = "";
        public int Grade { get; set; } = 1;
        public string? ExperimentalEffect { get; set; }
    }

    public class MaterialCost
    {
        public string Material { get; set; } = "";
        public int Quantity { get; set; }
        public int Grade { get; set; }
        public string Source { get; set; } = "blueprint";
    }

    public class EngineerVisit
    {
        public string Engineer { get; set; } = "";
        public string ModuleGroup { get; set; } = "";
        public string BlueprintName { get; set; } = "";
        public int Grade { get; set; }
    }

    public class EngineeringPlan
    {
        public List<MaterialCost> Materials { get; set; } = new();
        public Dictionary<string, int> MaterialTotal { get; set; } = new();
        public List<string> Engineers { get; set; } = new();
        public List<EngineerVisit> EngineerVisits { get; set; } = new();
    }

    public static class EngineeringPlanner
    {
        public static EngineeringPlan PlanEngineering(List<PlannedModification> modifications)
        {
            var materials = new List<MaterialCost>();
            var engineerVisits = new List<EngineerVisit>();
            var engineerSet = new HashSet<string>();

            var blueprints = DataProvider.Blueprints;
            var specials = DataProvider.Specials;
            var moduleBpMap = DataProvider.ModuleBlueprintMap;

            foreach (var mod in modifications)
            {
                // Blueprint material costs
                if (blueprints.ValueKind == JsonValueKind.Object &&
                    blueprints.TryGetProperty(mod.BlueprintName, out var bp))
                {
                    var grades = bp.GetProperty("grades");
                    if (grades.TryGetProperty(mod.Grade.ToString(), out var gradeData) &&
                        gradeData.TryGetProperty("components", out var components))
                    {
                        foreach (var comp in components.EnumerateObject())
                        {
                            materials.Add(new MaterialCost
                            {
                                Material = comp.Name,
                                Quantity = comp.Value.GetInt32(),
                                Grade = mod.Grade,
                                Source = "blueprint",
                            });
                        }
                    }
                }

                // Experimental effect materials
                if (!string.IsNullOrEmpty(mod.ExperimentalEffect) &&
                    specials.ValueKind == JsonValueKind.Object &&
                    specials.TryGetProperty(mod.ExperimentalEffect, out var special) &&
                    special.TryGetProperty("components", out var expComponents))
                {
                    foreach (var comp in expComponents.EnumerateObject())
                    {
                        materials.Add(new MaterialCost
                        {
                            Material = comp.Name,
                            Quantity = comp.Value.GetInt32(),
                            Grade = 0,
                            Source = "experimental",
                        });
                    }
                }

                // Engineer lookup
                if (moduleBpMap.ValueKind == JsonValueKind.Object &&
                    moduleBpMap.TryGetProperty(mod.ModuleGroup, out var mapping) &&
                    mapping.TryGetProperty("blueprints", out var bps) &&
                    bps.TryGetProperty(mod.BlueprintName, out var bpEntry) &&
                    bpEntry.TryGetProperty("grades", out var gradeMap) &&
                    gradeMap.TryGetProperty(mod.Grade.ToString(), out var engGrade) &&
                    engGrade.TryGetProperty("engineers", out var engineersArr))
                {
                    foreach (var eng in engineersArr.EnumerateArray())
                    {
                        var engName = eng.GetString() ?? "";
                        if (engineerSet.Add(engName))
                        {
                            engineerVisits.Add(new EngineerVisit
                            {
                                Engineer = engName,
                                ModuleGroup = mod.ModuleGroup,
                                BlueprintName = mod.BlueprintName,
                                Grade = mod.Grade,
                            });
                        }
                    }
                }
            }

            var materialTotal = new Dictionary<string, int>();
            foreach (var m in materials)
            {
                materialTotal.TryGetValue(m.Material, out var existing);
                materialTotal[m.Material] = existing + m.Quantity;
            }

            return new EngineeringPlan
            {
                Materials = materials,
                MaterialTotal = materialTotal,
                Engineers = engineerSet.OrderBy(e => e).ToList(),
                EngineerVisits = engineerVisits,
            };
        }

        public static List<MaterialCost> GetBlueprintComponents(string blueprintName, int grade)
        {
            var result = new List<MaterialCost>();
            var blueprints = DataProvider.Blueprints;

            if (blueprints.ValueKind != JsonValueKind.Object ||
                !blueprints.TryGetProperty(blueprintName, out var bp)) return result;

            var grades = bp.GetProperty("grades");
            if (!grades.TryGetProperty(grade.ToString(), out var gradeData)) return result;
            if (!gradeData.TryGetProperty("components", out var components)) return result;

            foreach (var comp in components.EnumerateObject())
            {
                result.Add(new MaterialCost
                {
                    Material = comp.Name,
                    Quantity = comp.Value.GetInt32(),
                    Grade = grade,
                    Source = "blueprint",
                });
            }
            return result;
        }

        public static List<MaterialCost> GetExperimentalEffectComponents(string effectName)
        {
            var result = new List<MaterialCost>();
            var specials = DataProvider.Specials;

            if (specials.ValueKind != JsonValueKind.Object ||
                !specials.TryGetProperty(effectName, out var special)) return result;
            if (!special.TryGetProperty("components", out var components)) return result;

            foreach (var comp in components.EnumerateObject())
            {
                result.Add(new MaterialCost
                {
                    Material = comp.Name,
                    Quantity = comp.Value.GetInt32(),
                    Grade = 0,
                    Source = "experimental",
                });
            }
            return result;
        }

        public static List<string> GetEngineersForBlueprint(string moduleGroup, string blueprintName, int grade)
        {
            var result = new List<string>();
            var moduleBpMap = DataProvider.ModuleBlueprintMap;

            if (moduleBpMap.ValueKind != JsonValueKind.Object) return result;
            if (!moduleBpMap.TryGetProperty(moduleGroup, out var mapping)) return result;
            if (!mapping.TryGetProperty("blueprints", out var bps)) return result;
            if (!bps.TryGetProperty(blueprintName, out var bpEntry)) return result;
            if (!bpEntry.TryGetProperty("grades", out var gradeMap)) return result;
            if (!gradeMap.TryGetProperty(grade.ToString(), out var engGrade)) return result;
            if (!engGrade.TryGetProperty("engineers", out var engineersArr)) return result;

            foreach (var eng in engineersArr.EnumerateArray())
            {
                var engName = eng.GetString();
                if (engName != null) result.Add(engName);
            }
            return result;
        }
    }
}
