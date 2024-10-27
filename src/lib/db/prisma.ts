import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const ability = (major, minor) => {
  const value = major + Math.min(major, minor);
  const margin = Math.trunc((Math.max(major, 50) - 50) / 5);

  let result = `${value}`;
  if (margin > 0) {
    result += ` / +${margin}`;
  }
  return result;
};

const extendPrisma = (prisma: ReturnType<typeof prismaClientSingleton>) => {
  return prisma
    .$extends({
      name: 'characters',
      result: {
        sheet: {
          body: {
            // Corps
            needs: {
              strength: true,
              agility: true,
              vivacity: true,
              vigour: true,
            },
            compute: (sheet) =>
              Math.trunc(
                (sheet.strength +
                  sheet.agility +
                  sheet.vivacity +
                  sheet.vigour) /
                  5,
              ),
          },
          spirit: {
            // esprit
            needs: {
              thinking: true,
              perception: true,
              concentration: true,
              understanding: true,
            },
            compute: (sheet) =>
              Math.trunc(
                (sheet.thinking +
                  sheet.perception +
                  sheet.concentration +
                  sheet.understanding) /
                  5,
              ),
          },
          soul: {
            // âme
            needs: { charisma: true, empathy: true, ego: true, will: true },
            compute: (sheet) =>
              Math.trunc(
                (sheet.charisma + sheet.empathy + sheet.ego + sheet.will) / 5,
              ),
          },
        },
      },
    })
    .$extends({
      name: 'abilities',
      result: {
        sheet: {
          mai: {
            needs: { soul: true },
            compute: (sheet) => Math.trunc(sheet.soul / 10),
          },
          directBlow: {
            // coup brutal
            needs: { strength: true, agility: true },
            compute: (sheet) => ability(sheet.strength, sheet.agility),
          },
          subtleBlow: {
            // coup subtil
            needs: { vivacity: true, agility: true },
            compute: (sheet) => ability(sheet.vivacity, sheet.agility),
          },
          deadlyBlow: {
            // coup mortel
            needs: { vivacity: true, concentration: true },
            compute: (sheet) => ability(sheet.vivacity, sheet.concentration),
          },
          parade: {
            // parade
            needs: { agility: true, strength: true },
            compute: (sheet) => ability(sheet.agility, sheet.strength),
          },
          dodge: {
            // esquive
            needs: { agility: true, vivacity: true },
            compute: (sheet) => ability(sheet.agility, sheet.vivacity),
          },
          discretion: {
            // discrétion
            needs: { agility: true, concentration: true },
            compute: (sheet) => ability(sheet.agility, sheet.concentration),
          },
          care: {
            // attention
            needs: { perception: true, empathy: true },
            compute: (sheet) => ability(sheet.perception, sheet.empathy),
          },
          reflexion: {
            // réflexion
            needs: { understanding: true, thinking: true },
            compute: (sheet) => ability(sheet.understanding, sheet.thinking),
          },
          improvisation: {
            // improvisation
            needs: { thinking: true, concentration: true },
            compute: (sheet) => ability(sheet.thinking, sheet.concentration),
          },
          shooting: {
            // tir
            needs: { perception: true, concentration: true },
            compute: (sheet) => ability(sheet.perception, sheet.concentration),
          },
          integrity: {
            // intégrité
            needs: { concentration: true, ego: true },
            compute: (sheet) => ability(sheet.concentration, sheet.ego),
          },
          focus: {
            // focus
            needs: { thinking: true, charisma: true },
            compute: (sheet) => ability(sheet.thinking, sheet.charisma),
          },
          spell: {
            // sortilège
            needs: { understanding: true, will: true },
            compute: (sheet) => ability(sheet.understanding, sheet.will),
          },
          ritual: {
            // rituel
            needs: { concentration: true, empathy: true },
            compute: (sheet) => ability(sheet.concentration, sheet.empathy),
          },
          feeling: {
            // impression
            needs: { empathy: true, perception: true },
            compute: (sheet) => ability(sheet.empathy, sheet.perception),
          },
          persuasion: {
            // persuasion
            needs: { charisma: true, ego: true },
            compute: (sheet) => ability(sheet.charisma, sheet.ego),
          },
          charm: {
            // séduction
            needs: { charisma: true, empathy: true },
            compute: (sheet) => ability(sheet.charisma, sheet.empathy),
          },
          intimidation: {
            // intimidation
            needs: { charisma: true, will: true },
            compute: (sheet) => ability(sheet.charisma, sheet.will),
          },
          fraud: {
            // tromperie
            needs: { charisma: true, concentration: true },
            compute: (sheet) => ability(sheet.charisma, sheet.concentration),
          },
          belief: {
            // conviction
            needs: { ego: true, will: true },
            compute: (sheet) => ability(sheet.ego, sheet.will),
          },
          resolution: {
            // résolution
            needs: { will: true, ego: true },
            compute: (sheet) => ability(sheet.will, sheet.ego),
          },
          damage: {
            // dégâts
            needs: { strength: true },
            compute: (sheet) => Math.trunc(sheet.strength / 10 - 5),
          },
          initiative: {
            // initiative
            needs: { vivacity: true },
            compute: (sheet) => Math.trunc(sheet.vivacity / 10),
          },
          impact: {
            // impact
            needs: { thinking: true },
            compute: (sheet) => Math.trunc(sheet.thinking / 10),
          },
          impulsion: {
            // impulsion
            needs: { perception: true },
            compute: (sheet) => Math.trunc(sheet.perception / 10),
          },
          conduction: {
            // conduction
            needs: { concentration: true },
            compute: (sheet) => Math.trunc(sheet.concentration / 10),
          },
          health: {
            // santé
            needs: { vigour: true },
            compute: (sheet) => Math.trunc(sheet.vigour / 10),
          },
          healthThreshold: {
            // seuil de santé
            needs: { vigour: true },
            compute: (sheet) => Math.trunc(sheet.vigour / 5),
          },
          stability: {
            // équilibre
            needs: { understanding: true },
            compute: (sheet) => Math.trunc(sheet.understanding / 10),
          },
          stabilityThreshold: {
            // seuil d'équiilbre
            needs: { understanding: true },
            compute: (sheet) => Math.trunc(sheet.understanding / 5),
          },
          radiance: {
            // éclat
            needs: { soul: true },
            compute: (sheet) => Math.trunc(sheet.soul / 10),
          },
          radianceThreshold: {
            // seuil d'éclat
            needs: { soul: true },
            compute: (sheet) => Math.trunc(sheet.soul / 5),
          },
        },
      },
    })
    .$extends({
      name: 'experience',
      result: {
        sheet: {
          spent_feel_xp: {
            needs: { feel_xp: true, to_spend_feel_xp: true },
            compute: (sheet) => sheet.feel_xp - sheet.to_spend_feel_xp,
          },
          spent_learn_xp: {
            needs: { learn_xp: true, to_spend_learn_xp: true },
            compute: (sheet) => sheet.learn_xp - sheet.to_spend_learn_xp,
          },
          spent_live_xp: {
            needs: { live_xp: true, to_spend_live_xp: true },
            compute: (sheet) => sheet.live_xp - sheet.to_spend_live_xp,
          },
        },
      },
    });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof extendPrisma>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? extendPrisma(prismaClientSingleton());

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
