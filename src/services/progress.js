import { fetchProgrammingProgress } from "./moocfi"
import { zip } from "../util/arrays"
import { fetchQuiznatorProgress } from "./quiznator"

export async function fetchProgress() {
  const serviceIdentifiers = ["Ohjelmointitehtävät", "Kyselyt"]
  const progressesCollection = await Promise.all([
    fetchProgrammingProgress(),
    fetchQuiznatorProgress(),
  ])
  const progressByGroup = {}

  zip(serviceIdentifiers, progressesCollection).forEach(
    ([identifier, progresses]) => {
      progresses.forEach(progressEntry => {
        if (!progressByGroup[progressEntry.group]) {
          progressByGroup[progressEntry.group] = {}
        }
        progressByGroup[progressEntry.group][identifier] = progressEntry
      })
    },
  )
  const toBeDeleted = []
  Object.entries(progressByGroup).forEach(([group, serviceEntries]) => {
    if (!Object.keys(serviceEntries).find(o => o === "Ohjelmointitehtävät")) {
      toBeDeleted.push(group)
    }
  })
  toBeDeleted.forEach(o => {
    delete progressByGroup[o]
  })
  return progressByGroup
}
