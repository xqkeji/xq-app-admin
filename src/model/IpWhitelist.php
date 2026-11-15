<?php
namespace xqkeji\app\admin\model;
use xqkeji\mvc\model\Model;
use xqkeji\mvc\model\Config;
use xqkeji\Event;
use xqkeji\App;
class IpWhitelist extends Model
{
	// 请求内记忆化，整份配置每请求只反序列化一次
	private static ?array $cache=null;

	public function afterWrite($data=null)
	{
		$this->rebuildCache();
	}

	public function afterDelete($data=null)
	{
		$this->rebuildCache();
	}

	// 客户端 IP 是否在白名单内：精确 IP 先查表，网段按掩码分桶、每桶一次哈希探测
	// 只判断「在不在名单里」，ip_whitelist_open 开关由调用点决定
	public static function allows(string $ip): bool
	{
		$cache=self::readCache();
		if(isset($cache['single'][$ip]))
		{
			return true;
		}
		// 缓存只收 IPv4，IPv6 客户端必然不在名单内
		$long=ip2long($ip);
		if($long===false)
		{
			return false;
		}
		foreach($cache['cidr'] as $mask=>$bucket)
		{
			$bucket=(array)$bucket;
			if(isset($bucket[$long&(int)$mask]))
			{
				return true;
			}
		}
		return false;
	}

	// 读缓存，同一次请求内只读一次配置
	private static function readCache(): array
	{
		if(self::$cache===null)
		{
			$cache=(array)Config::get('admin_ip_whitelist');
			self::$cache=[
				'single'=>(array)($cache['single'] ?? []),
				'cidr'=>(array)($cache['cidr'] ?? []),
			];
		}
		return self::$cache;
	}

	// 重建白名单缓存：single 是精确 IP 的查找表；cidr 按掩码分桶，桶键为网络位、值为原始写法
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
			// 历史遗留的 IPv6 行算不出掩码，跳过以免污染缓存
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
			$cidr[$mask][$long&$mask]=$entry;
		}
		Config::set('admin_ip_whitelist',['single'=>$single,'cidr'=>$cidr]);
		// 本次请求已读过的旧缓存立即作废
		self::$cache=null;
	}
}
