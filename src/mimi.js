const exec = require('child_process').exec

module.exports.getProcess = (callback) => {
    exec('Get-Process | Select Name, Path | ConvertTo-Json', {shell: 'powershell.exe'}, function(error, stdout, stderr){
        callback(JSON.parse(stdout));
    });
}
module.exports.getValues = (callback) => {
    exec('reg query HKCU\\SOFTWARE\\MICROSOFT\\DIRECTX\\USERGPUPREFERENCES | ConvertTo-JSON', {shell: 'powershell.exe'}, function(error, stdout, stderr){
        const obj = (JSON.parse(stdout)).filter(item => item.includes('REG_SZ'));
        callback(obj)
    });
}
module.exports.setNewValue = (obj, callback) => {
    exec(`reg add HKCU\\SOFTWARE\\MICROSOFT\\DIRECTX\\USERGPUPREFERENCES /f /v "${obj.Path}" /d "${obj.Value}"`, {shell: 'powershell'}, function(error, stdout, stderr){
        callback(null, true);
    });
}
module.exports.removeValue = (key, callback) => {
    exec(`reg delete HKCU\\SOFTWARE\\MICROSOFT\\DIRECTX\\USERGPUPREFERENCES /f /v "${key}"`, {shell: 'powershell'}, function(error, stdout, stderr){
        callback(null, true);
    });
}