module SetIpdcCode

  open FSharp.Data
  open FSharp.Data.JsonExtensions

  open CommonLibrary
  open PublicService.Backoffice

  [<Literal>]
  let SampleFile = "Import/IpdcId/ipdc-id.csv"

  type IpdcIds =
    CsvProvider<Sample      = SampleFile,
                Separators  = "|",
                HasHeaders  = true,
                Encoding    = "utf-8"
                >

  type Counter = { Total: int; Successes: int }

  let getRows (batchFile:string) =
    let ipdcIds = IpdcIds.Load(batchFile)
    ipdcIds.Rows

  let importRow counter apiBaseUrl token rowCount cursorTop (row:IpdcIds.Row) =

    let result =
      putIpdcCode apiBaseUrl token row.``Ipdc-ID-link`` row.Id

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
