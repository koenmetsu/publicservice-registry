module AddLifeCycleStage

  open FSharp.Data
  open FSharp.Data.JsonExtensions

  open CommonLibrary
  open PublicService.Backoffice

  [<Literal>]
  let SampleFile = "Import/Status/dvr-status.csv"

  type LifeCycleStages =
    CsvProvider<Sample      = SampleFile,
                Separators  = "|",
                HasHeaders  = true,
                Encoding    = "utf-8"
                >

  type Counter = { Total: int; Successes: int }

  let getRows (batchFile:string) =
    let lifeCycleStages = LifeCycleStages.Load(batchFile)
    lifeCycleStages.Rows

  let private toIpdcStatus (row:LifeCycleStages.Row) =
      match row.``Status uit ipdc`` with
      | "actief" -> "Active"
      | "stopgezet" -> "Stopped"
      | "uitdovend" -> "PhasingOut"
      | "gepland" -> "Planned"
      | _ -> failwithf "Found invalid status in the import rows: status <%s> for <%s>" row.``Status uit ipdc`` row.Id

  let validateRows (rows:seq<LifeCycleStages.Row>): seq<LifeCycleStages.Row> =
    rows
    |> List.ofSeq
    |> List.map toIpdcStatus
    |> ignore

    rows

  let importRow counter apiBaseUrl token rowCount cursorTop (row:LifeCycleStages.Row) =

    let result =
      postLifeCycleStage apiBaseUrl token (toIpdcStatus row) "" "" row.Id

    let counter =
      match result with
      | Success _ -> { Total = counter.Total + 1; Successes = counter.Successes + 1 }
      | Failure _ -> { Total = counter.Total + 1; Successes = counter.Successes }

    System.Console.CursorTop <- cursorTop
    printfn ""
    printfn "\rProcessing %i/%i ..." counter.Total rowCount
    printfn "\rSuccesses: %i/%i ..." counter.Successes rowCount
    printfn "\rErrors: %i/%i ..." (counter.Total - counter.Successes) rowCount

    (row.Id, result), counter


  let importRows apiBaseUrl token rows =
    let rowCount = Seq.length rows
    let cursorTop = System.Console.CursorTop
    Seq.mapFold (fun i row -> importRow i apiBaseUrl token rowCount cursorTop row) { Total = 0; Successes = 0 } rows
    |> fun (x, _) -> x
    |> Seq.toList
