// Auto-generated from FDevIDs
export interface Passenger {
  fdname: string;
  name: string;
}

export const passengers: Passenger[] = [
  { fdname: "Business", name: "Business" },
  { fdname: "Criminal", name: "Criminal" },
  { fdname: "Explorer", name: "Explorer" },
  { fdname: "HeadOfState", name: "Head Of State" },
  { fdname: "Medical", name: "Medical" },
  { fdname: "MinorCelebrity", name: "Minor Celebrity" },
  { fdname: "PoliticalPrisoner", name: "Political Prisoner" },
  { fdname: "Politician", name: "Politician" },
  { fdname: "POW", name: "Prisoner of War" },
  { fdname: "Protester", name: "Protester" },
  { fdname: "Refugee", name: "Refugee" },
  { fdname: "Scientist", name: "Scientist" },
  { fdname: "Security", name: "Security" },
  { fdname: "Soldier", name: "Soldier" },
  { fdname: "Terrorist", name: "Terrorist" },
  { fdname: "Tourist", name: "Tourist" },
  { fdname: "AidWorker", name: "Aid Worker" },
];

export const passengersByFdname = new Map<string, Passenger>(
  passengers.map((r) => [r.fdname, r]),
);
