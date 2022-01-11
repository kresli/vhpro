interface Grade {
  count: 0;
  severe: false;
}
interface Level {
  about: "I'm unable to function due to stress or anxiety.";
  ctcae: "Life-threatening consequences; urgent intervention indicated";
  end: 100;
  id: 4;
  isDanger: true;
  start: 76;
}
export interface Symptom {
  count: number;
  grades: Record<string, Grade>;
  logType: {
    ctcaeVersion: "5.0";
    deprecated: false;
    identifier: "ANXIETY_STRESS";
    levels: Level[];
    logClass: "SYMPTOMS";
    logTypeId: 220;
    manuallyLogged: true;
    name: "Anxiety/Stress";
  };
}
