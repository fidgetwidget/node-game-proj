PLAYERSKILLS = [
  
  'FARMING'
  # - TILLING_SOIL
  # - PLANTING (seeds and saplings)
  # - PLANT_CARE (watering/pruneing)
  # - HARVESTING

  'FORESTRY'
  # - cutting branches
  # - chopping trees
  # - planting saplings

  'MINING'
  # - breaking rocks
  # - mining ore

  'HERBALISM'
  # - cutting herbs
  # - mixing herbs

  'HUSBANDRY'
  # - animal care
  # - animal taming
  # - animal breeding

  'BLACKSMITHING'


]


class @PlayerStats

  player:   undefined
  timers:   undefined

  health:   undefined
  fatigue:  0
  hunger:   0
  thirst:   0

  physical: 1
  intelect: 1
  mystical: 1

  skills: {
    'woodcutting': 0

  }

