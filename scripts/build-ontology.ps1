param(
  [string]$InputCsv = "$PSScriptRoot\..\tmp-uk-sanctions.csv",
  [string]$OutputJson = "$PSScriptRoot\..\public\data\ontology.json",
  [string]$SourceUrl = "https://sanctionslist.fcdo.gov.uk/docs/UK-Sanctions-List.csv"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $InputCsv)) {
  Write-Output "Downloading current UK Sanctions List..."
  Invoke-WebRequest -Uri $SourceUrl -OutFile $InputCsv
}

function Slug([string]$Value) {
  return (($Value.ToLowerInvariant() -replace "[^a-z0-9]+", "-").Trim("-"))
}

function Values([object[]]$Rows, [string]$Field) {
  return @(
    $Rows |
      ForEach-Object { $_.$Field } |
      Where-Object { $_ -and $_.Trim() } |
      ForEach-Object { $_.Trim() } |
      Select-Object -Unique
  )
}

function Split-Values([object[]]$Rows, [string]$Field) {
  return @(
    Values $Rows $Field |
      ForEach-Object { $_ -split "\|" } |
      ForEach-Object { $_.Trim() } |
      Where-Object { $_ } |
      Select-Object -Unique
  )
}

function Full-Name([object]$Row) {
  return (@($Row.'Name 1', $Row.'Name 2', $Row.'Name 3', $Row.'Name 4', $Row.'Name 5', $Row.'Name 6') |
    Where-Object { $_ -and $_.Trim() } |
    ForEach-Object { $_.Trim() }) -join " "
}

$raw = Get-Content -Path $InputCsv
$reportDate = ($raw[0] -replace "^Report Date:\s*", "").Trim()
$rows = $raw | Select-Object -Skip 1 | ConvertFrom-Csv

$cohorts = @(
  @{ Pattern = "Russia"; Limit = 450 },
  @{ Pattern = "Iran"; Limit = 250 },
  @{ Pattern = "Democratic People's Republic of Korea"; Limit = 130 },
  @{ Pattern = "Belarus"; Limit = 100 },
  @{ Pattern = "Syria"; Limit = 100 },
  @{ Pattern = "Myanmar"; Limit = 70 },
  @{ Pattern = "Global Human Rights"; Limit = 50 },
  @{ Pattern = "Cyber"; Limit = 50 }
)

$selectedGroups = @()
$seen = @{}

foreach ($cohort in $cohorts) {
  $groups = $rows |
    Where-Object { $_.'Regime Name' -match $cohort.Pattern } |
    Group-Object 'Unique ID' |
    Sort-Object Name |
    Select-Object -First $cohort.Limit

  foreach ($group in $groups) {
    if (-not $seen.ContainsKey($group.Name)) {
      $selectedGroups += $group
      $seen[$group.Name] = $true
    }
  }
}

$entities = @()
foreach ($group in $selectedGroups) {
  $items = $group.Group
  $primary = $items | Where-Object { $_.'Alias strength' -eq "Primary Name" } | Select-Object -First 1
  if (-not $primary) { $primary = $items | Select-Object -First 1 }

  $name = Full-Name $primary

  $countries = @(
    Values $items "Address Country"
    Split-Values $items "Nationality(/ies)"
    Values $items "Country of birth"
    Values $items "Current believed flag of ship"
  ) | Where-Object { $_ } | Select-Object -Unique

  $aliases = @($items | ForEach-Object { Full-Name $_ } | Where-Object { $_ -and $_ -ne $name } | Select-Object -Unique -First 12)
  $entityType = if ($primary.'Designation Type') { $primary.'Designation Type' } elseif ($primary.'Type of entity') { $primary.'Type of entity' } else { "Entity" }
  $reason = ($items | Where-Object { $_.'UK Statement of Reasons' } | Select-Object -First 1).'UK Statement of Reasons'
  $other = ($items | Where-Object { $_.'Other Information' } | Select-Object -First 1).'Other Information'

  $entities += [ordered]@{
    id = $group.Name
    name = $name
    aliases = @($aliases)
    type = $entityType
    regime = $primary.'Regime Name'
    designationSource = $primary.'Designation source'
    sanctions = @(Split-Values $items "Sanctions Imposed")
    countries = @($countries | Select-Object -First 6)
    position = @((Split-Values $items "Position") | Select-Object -First 5)
    website = @((Values $items "Website") | Select-Object -First 3)
    parentCompany = @((Values $items "Parent company") | Select-Object -First 3)
    subsidiaries = @((Values $items "Subsidiaries") | Select-Object -First 3)
    imoNumber = @((Values $items "IMO number") | Select-Object -First 3)
    dateDesignated = $primary.'Date Designated'
    lastUpdated = $primary.'Last Updated'
    reason = if ($reason) { $reason.Substring(0, [Math]::Min(800, $reason.Length)) } else { "" }
    otherInformation = if ($other) { $other.Substring(0, [Math]::Min(500, $other.Length)) } else { "" }
    sourceUrl = "https://sanctionslist.fcdo.gov.uk/"
  }
}

$relationships = @()
$nameIndex = @{}
foreach ($entity in $entities) { $nameIndex[$entity.name.ToLowerInvariant()] = $entity.id }

foreach ($entity in $entities) {
  $regimeId = "regime:" + (Slug $entity.regime)
  $relationships += [ordered]@{
    id = "$($entity.id):regime"
    source = $entity.id
    target = $regimeId
    type = "designated-under"
    evidence = "UK Sanctions List"
    sourceUrl = $entity.sourceUrl
  }

  foreach ($country in $entity.countries) {
    $relationships += [ordered]@{
      id = "$($entity.id):country:" + (Slug $country)
      source = $entity.id
      target = "country:" + (Slug $country)
      type = "associated-with-country"
      evidence = "UK Sanctions List"
      sourceUrl = $entity.sourceUrl
    }
  }

  foreach ($sanction in $entity.sanctions) {
    $relationships += [ordered]@{
      id = "$($entity.id):sanction:" + (Slug $sanction)
      source = $entity.id
      target = "sanction:" + (Slug $sanction)
      type = "subject-to"
      evidence = "UK Sanctions List"
      sourceUrl = $entity.sourceUrl
    }
  }

  foreach ($parent in $entity.parentCompany) {
    $parentId = $nameIndex[$parent.ToLowerInvariant()]
    if ($parentId) {
      $relationships += [ordered]@{
        id = "$($entity.id):parent:$parentId"
        source = $entity.id
        target = $parentId
        type = "declared-parent"
        evidence = "UK Sanctions List"
        sourceUrl = $entity.sourceUrl
      }
    }
  }
}

$facets = [ordered]@{
  regimes = @($entities | Group-Object { $_["regime"] } | Sort-Object Count -Descending | ForEach-Object { [ordered]@{ name = $_.Name; count = $_.Count } })
  types = @($entities | Group-Object { $_["type"] } | Sort-Object Count -Descending | ForEach-Object { [ordered]@{ name = $_.Name; count = $_.Count } })
  countries = @($entities | ForEach-Object { $_["countries"] } | Where-Object { $_ } | Group-Object | Sort-Object Count -Descending | Select-Object -First 30 | ForEach-Object { [ordered]@{ name = $_.Name; count = $_.Count } })
  sanctions = @($entities | ForEach-Object { $_["sanctions"] } | Where-Object { $_ } | Group-Object | Sort-Object Count -Descending | ForEach-Object { [ordered]@{ name = $_.Name; count = $_.Count } })
}

$result = [ordered]@{
  meta = [ordered]@{
    sourceName = "UK Sanctions List"
    sourceUrl = "https://sanctionslist.fcdo.gov.uk/"
    sourceUpdated = $reportDate
    generatedAt = (Get-Date).ToUniversalTime().ToString("o")
    entityCount = $entities.Count
    relationshipCount = $relationships.Count
    methodology = "A reproducible 1,200-record starter slice prioritising Russia, Iran, DPRK, Belarus, Syria, Myanmar, Global Human Rights, and Cyber regimes. Relationships reflect explicit fields in the source list."
  }
  entities = $entities
  relationships = $relationships
  facets = $facets
}

$directory = Split-Path -Parent $OutputJson
New-Item -ItemType Directory -Force -Path $directory | Out-Null
$result | ConvertTo-Json -Depth 10 -Compress | Set-Content -Encoding utf8 -Path $OutputJson

Write-Output "Wrote $($entities.Count) entities and $($relationships.Count) relationships to $OutputJson"
