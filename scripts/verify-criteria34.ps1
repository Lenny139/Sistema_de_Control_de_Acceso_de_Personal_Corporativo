$base='http://localhost:3000/api/1.0'
$ger=Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{username='gerente';password='gerente123'}|ConvertTo-Json)
$guard=Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{username='guardia1';password='guardia123'}|ConvertTo-Json)
$gerHeaders=@{Authorization="Bearer $($ger.accessToken)"}
$guardHeaders=@{Authorization="Bearer $($guard.accessToken)"}
$empleado=(Invoke-RestMethod -Uri "$base/employees" -Headers $gerHeaders -Method Get)[0]
$checkpoint=(Invoke-RestMethod -Uri "$base/checkpoints" -Headers $guardHeaders -Method Get)[0]

node scripts/seed-report-data.js $($empleado.id) $($checkpoint.id)

$ayer=(Get-Date).AddDays(-1).ToString('yyyy-MM-dd')
$hoy=(Get-Date).ToString('yyyy-MM-dd')

$asistencia=Invoke-RestMethod -Uri "$base/reports/asistencia?empleadoId=$($empleado.id)&fechaInicio=$ayer&fechaFin=$ayer" -Headers $gerHeaders -Method Get
$item=$asistencia.data[0]
Write-Output ('C3_ASISTENCIA_OK=' + ($item.horaEntrada -eq '09:00' -and $item.horaSalida -eq '17:00' -and [double]$item.horasTrabajadas -eq 8))

$punt=Invoke-RestMethod -Uri "$base/reports/puntualidad?empleadoId=$($empleado.id)&fechaInicio=$hoy&fechaFin=$hoy" -Headers $gerHeaders -Method Get
$pitem=$punt.data[0]
Write-Output ('C4_TARDANZA_ESTADO=' + ($pitem.estadoPuntualidad -eq 'TARDANZA'))
Write-Output ('C4_TARDANZA_MINUTOS=' + ([int]$pitem.minutosRetraso -eq 15))
