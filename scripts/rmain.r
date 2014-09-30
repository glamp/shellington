#!/usr/bin/env Rscript
library(rjson)
library(evaluate)

f <- file("stdin")
delim <- commandArgs()[6]
write(paste("Delim is: ", delim), stderr())

open(f)
while(length(line <- readLines(f,n=1)) > 0) {
  line <- rjson::fromJSON(line)
  code <- line[["code"]]
  #result <- evaluate::evaluate(code)
  #if (length(result)==2) {
  #  output <- result[[2]]
  #} else {
  #  output <- ""
  #}
  output <- eval(parse(text=code))
  output <- data.frame(result=output)
  output.json <- paste0(rjson::toJSON(output), delim)
  write(output.json, stdout())
  write(output.json, stderr())
}
