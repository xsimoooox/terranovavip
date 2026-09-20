/**
 * Système de zonage avancé TERRANOVA Intelligence - 12 Zones Indépendantes
 * Calibré pour 2 hectares de Vigne
 */

const GAIA_ZONING_SIMULATION = {
    metadata: {
        total_area_hectares: 2,
        target_crop: "Fruits de l'arganier",
        simulation_duration: "Dynamique (93-140 Jours)",
        ai_engine: "TERRANOVA-MultiZone-Core v6.1"
    },
    zones: [
        { id: "Z01", name: "Zone Nord-Est 1", i18nName: "zone_ne1", area_ht: 5.2, soil: "Argilo-Calcaire", i18nSoil: "soil_arg_calc", moisture: "14%", ndvi: 0.38, target_yield: "+62%" },
        { id: "Z02", name: "Zone Nord-Est 2", i18nName: "zone_ne2", area_ht: 8.4, soil: "Limoneux", i18nSoil: "soil_limoneux", moisture: "18%", ndvi: 0.45, target_yield: "+45%" },
        { id: "Z03", name: "Versant Est", i18nName: "zone_ve", area_ht: 4.1, soil: "Sableux-Graveleux", i18nSoil: "soil_sableux_grav", moisture: "10%", ndvi: 0.32, target_yield: "+75%" },
        { id: "Z04", name: "Plaine Centrale A", i18nName: "zone_pca", area_ht: 12.3, soil: "Argileux lourd", i18nSoil: "soil_argileux_lourd", moisture: "25%", ndvi: 0.41, target_yield: "+55%" },
        { id: "Z05", name: "Plaine Centrale B", i18nName: "zone_pcb", area_ht: 7.0, soil: "Argileux", i18nSoil: "soil_argileux", moisture: "22%", ndvi: 0.48, target_yield: "+48%" },
        { id: "Z06", name: "Coteau Sud A", i18nName: "zone_csa", area_ht: 6.5, soil: "Calcaire", i18nSoil: "soil_calcaire", moisture: "12%", ndvi: 0.35, target_yield: "+68%" },
        { id: "Z07", name: "Coteau Sud B", i18nName: "zone_csb", area_ht: 9.2, soil: "Roches/Calcaire", i18nSoil: "soil_roc_calc", moisture: "11%", ndvi: 0.33, target_yield: "+70%" },
        { id: "Z08", name: "Bordure Ouest", i18nName: "zone_bo", area_ht: 3.8, soil: "Alluvionnaire", i18nSoil: "soil_alluvionnaire", moisture: "20%", ndvi: 0.52, target_yield: "+35%" },
        { id: "Z09", name: "Vallon Humide", i18nName: "zone_vh", area_ht: 10.5, soil: "Humifère", i18nSoil: "soil_humifere", moisture: "32%", ndvi: 0.58, target_yield: "+25%" },
        { id: "Z10", name: "Crête Nord", i18nName: "zone_cn", area_ht: 4.4, soil: "Érodé/Sable", i18nSoil: "soil_erode_sable", moisture: "9%", ndvi: 0.28, target_yield: "+82%" },
        { id: "Z11", name: "Zone Pivot Est", i18nName: "zone_zpe", area_ht: 6.1, soil: "Mixte", i18nSoil: "soil_mixte", moisture: "16%", ndvi: 0.44, target_yield: "+50%" },
        { id: "Z12", name: "Zone Pivot Ouest", i18nName: "zone_zpo", area_ht: 6.0, soil: "Mixte", i18nSoil: "soil_mixte", moisture: "17%", ndvi: 0.46, target_yield: "+48%" }
    ],
    getBilanPlan: function (zoneId) {
        const zone = this.zones.find(z => z.id === zoneId);
        const area = zone.area_ht;
        return {
            eau_totale: (area * 1250).toFixed(0), // m3
            compost_total: (area * 35).toFixed(1), // Tonnes
            amendements_kg: (area * 180).toFixed(0), // kg
            co2_sequestre: (area * 2.8).toFixed(1), // tCO2
            cout_estime: (area * 350).toFixed(0) // Euros
        };
    }
};
