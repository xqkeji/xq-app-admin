<?php
namespace xqkeji\app\admin\model;
use xqkeji\mvc\model\Model;
use xqkeji\mvc\model\Config;
use xqkeji\Event;
use xqkeji\App;
class IpWhitelist extends Model
{
	public function afterWrite($data=null)
	{
		$this->rebuildCache();
	}

	public function afterDelete($data=null)
	{
		$this->rebuildCache();
	}

	// 重建白名单缓存：single 是精确 IP 的查找表（isset 判定），cidr 是算好网络位与掩码的网段表
	// 掩码按 32 位无符号整数存，检测时 (ip2long($ip) & mask) === network 即命中
	protected function rebuildCache(): void
	{
		$single=[];
		$cidr=[];
		$rows=$this->db()->where(['status'=>1])->findAll();
		foreach($rows as $row)
		{
			$entry=trim((string)$row['allow_entry']);
			if($entry==='')
			{
				continue;
			}
			$pos=strpos($entry,'/');
			$ip=$pos===false?$entry:substr($entry,0,$pos);
			$bits=$pos===false?32:(int)substr($entry,$pos+1);
			// 只支持 IPv4，历史遗留的 IPv6 行算不出掩码，跳过以免污染缓存
			$long=ip2long($ip);
			if($long===false)
			{
				continue;
			}
			if($bits>=32)
			{
				$single[$ip]=1;
				continue;
			}
			$mask=(-1<<(32-$bits))&0xFFFFFFFF;
			$cidr[]=['entry'=>$entry,'network'=>$long&$mask,'mask'=>$mask];
		}
		Config::set('admin_ip_whitelist',['single'=>$single,'cidr'=>$cidr]);
	}
}
