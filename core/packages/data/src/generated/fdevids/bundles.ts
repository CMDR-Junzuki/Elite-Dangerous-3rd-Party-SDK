// Auto-generated from FDevIDs
export interface Bundle {
  id: number;
  name: string;
  sku: string;
}

export const bundles: Bundle[] = [
  { id: 129030471, name: 'AX COMBAT JUMPSTART ALLIANCE CHIEFTAIN', sku: 'FORC_FDEV_V_CHIEFTAIN_BUNDLE_001' },
  { id: 129030472, name: 'LASER MINING JUMPSTART TYPE-6', sku: 'FORC_FDEV_V_TYPE6_BUNDLE_001' },
  { id: 129030473, name: 'EXPLORATION JUMPSTART DIAMONDBACK EXPLORER', sku: 'FORC_FDEV_V_DIAMOND_EXPLORER_BUNDLE_001' },
  { id: 129030512, name: 'PYTHON MK II STELLAR', sku: 'FORC_FDEV_V_PYTHON_MKII_BUNDLE_001' },
  { id: 129030519, name: 'PYTHON MK II STANDARD', sku: 'FORC_FDEV_V_PYTHON_MKII_BUNDLE_002' },
];

export const bundlesById = new Map<number, Bundle>(
  bundles.map(r => [r.id, r])
);

